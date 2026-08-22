import * as THREE from "three";

const PLAYER_RADIUS = 0.24;
const EYE_HEIGHT = 1.65;
const MOVE_SPEED = 3.4; // m/s walking speed
const SPRINT_MULT = 1.8;
const DAMPING = 10;

export class FirstPersonControls {
  constructor(camera, domElement, colliders, spawn) {
    this.domElement = domElement;
    this.colliders = colliders;
    this.started = false; // game running: keys + look active, overlay hidden
    this.pointerLocked = false; // true only if the OS actually granted pointer lock

    this.yawObject = new THREE.Object3D();
    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(camera);
    this.yawObject.add(this.pitchObject);
    this.yawObject.position.set(spawn.x, EYE_HEIGHT, spawn.z);
    this.yawObject.rotation.y = spawn.yaw ?? 0;

    this.velocity = new THREE.Vector3(); // world-space XZ velocity
    this.keys = { forward: false, back: false, left: false, right: false, sprint: false };

    this._forward = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._wishDir = new THREE.Vector3();

    this._dragging = false;
    this._lastX = 0;
    this._lastY = 0;

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onDragMove = this._onDragMove.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onPointerLockChange = this._onPointerLockChange.bind(this);
    this._onPointerLockError = this._onPointerLockError.bind(this);

    document.addEventListener("pointerlockchange", this._onPointerLockChange);
    document.addEventListener("pointerlockerror", this._onPointerLockError);
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("keyup", this._onKeyUp);
    this.domElement.addEventListener("mousedown", this._onMouseDown);

    this.onStartChange = null; // callback(started: boolean)
  }

  get object() {
    return this.yawObject;
  }

  // Begin play: hides the overlay immediately and enables WASD + click-drag
  // look right away. Pointer Lock is attempted as an enhancement (hides the
  // cursor, gives unbounded mouse-look) but play works fully without it —
  // some embedding contexts (e.g. a sandboxed iframe) silently refuse
  // Pointer Lock, and previously that left the game stuck on the overlay
  // with no fallback at all.
  start() {
    if (this.started) return;
    this.started = true;
    if (this.onStartChange) this.onStartChange(true);
    try {
      const result = this.domElement.requestPointerLock?.();
      if (result && typeof result.catch === "function") {
        result.catch(() => {
          /* Pointer Lock unavailable — click-drag look stays active. */
        });
      }
    } catch {
      /* Some browsers throw synchronously instead of rejecting. */
    }
  }

  pause() {
    if (!this.started) return;
    this.started = false;
    if (document.pointerLockElement === this.domElement) document.exitPointerLock();
    this.keys.forward = this.keys.back = this.keys.left = this.keys.right = false;
    this._dragging = false;
    this.domElement.classList.remove("dragging");
    document.removeEventListener("mousemove", this._onDragMove);
    document.removeEventListener("mouseup", this._onDragEnd);
    if (this.onStartChange) this.onStartChange(false);
  }

  _onPointerLockChange() {
    this.pointerLocked = document.pointerLockElement === this.domElement;
    if (this.pointerLocked) {
      document.addEventListener("mousemove", this._onMouseMove);
    } else {
      document.removeEventListener("mousemove", this._onMouseMove);
      // The browser exits pointer lock on its own Esc handling; treat that
      // the same as our own pause so the overlay comes back.
      if (this.started) this.pause();
    }
  }

  _onPointerLockError() {
    this.pointerLocked = false; // click-drag look remains available
  }

  _onMouseMove(e) {
    this._applyLook(e.movementX, e.movementY);
  }

  // Click-and-drag look — the fallback that always works, regardless of
  // Pointer Lock availability.
  _onMouseDown(e) {
    if (!this.started || this.pointerLocked) return;
    this._dragging = true;
    this.domElement.classList.add("dragging");
    this._lastX = e.clientX;
    this._lastY = e.clientY;
    document.addEventListener("mousemove", this._onDragMove);
    document.addEventListener("mouseup", this._onDragEnd);
  }

  _onDragMove(e) {
    const dx = e.clientX - this._lastX;
    const dy = e.clientY - this._lastY;
    this._lastX = e.clientX;
    this._lastY = e.clientY;
    this._applyLook(dx, dy);
  }

  _onDragEnd() {
    this._dragging = false;
    this.domElement.classList.remove("dragging");
    document.removeEventListener("mousemove", this._onDragMove);
    document.removeEventListener("mouseup", this._onDragEnd);
  }

  _applyLook(dx, dy) {
    const sensitivity = 0.0022;
    this.yawObject.rotation.y -= dx * sensitivity;
    this.pitchObject.rotation.x -= dy * sensitivity;
    const maxPitch = Math.PI / 2 - 0.05;
    this.pitchObject.rotation.x = Math.max(-maxPitch, Math.min(maxPitch, this.pitchObject.rotation.x));
  }

  _setKey(code, value) {
    switch (code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = value;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.back = value;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = value;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = value;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.keys.sprint = value;
        break;
      default:
        break;
    }
  }

  _onKeyDown(e) {
    if (!this.started) return;
    if (e.code === "Escape") {
      this.pause();
      return;
    }
    this._setKey(e.code, true);
  }

  _onKeyUp(e) {
    this._setKey(e.code, false);
  }

  _resolveCollision(x, z) {
    for (const c of this.colliders) {
      if (x > c.x1 - PLAYER_RADIUS && x < c.x2 + PLAYER_RADIUS && z > c.z1 - PLAYER_RADIUS && z < c.z2 + PLAYER_RADIUS) {
        return true;
      }
    }
    return false;
  }

  update(delta) {
    const forwardInput = (this.keys.forward ? 1 : 0) - (this.keys.back ? 1 : 0);
    const strafeInput = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);

    // Derive world-space forward/right directly from the yaw object's own
    // orientation (rather than hand-rolled trig) so movement always matches
    // the direction the camera is actually rendering.
    this._forward.set(0, 0, -1).applyQuaternion(this.yawObject.quaternion);
    this._right.set(1, 0, 0).applyQuaternion(this.yawObject.quaternion);

    this._wishDir.set(0, 0, 0);
    if (forwardInput) this._wishDir.addScaledVector(this._forward, forwardInput);
    if (strafeInput) this._wishDir.addScaledVector(this._right, strafeInput);
    if (this._wishDir.lengthSq() > 1) this._wishDir.normalize(); // no diagonal speed boost

    const speed = MOVE_SPEED * (this.keys.sprint ? SPRINT_MULT : 1);
    const targetVX = this._wishDir.x * speed;
    const targetVZ = this._wishDir.z * speed;

    // Damped acceleration toward target world-space velocity for smooth start/stop.
    const damp = 1 - Math.exp(-DAMPING * delta);
    this.velocity.x += (targetVX - this.velocity.x) * damp;
    this.velocity.z += (targetVZ - this.velocity.z) * damp;

    const dx = this.velocity.x * delta;
    const dz = this.velocity.z * delta;

    const pos = this.yawObject.position;
    if (!this._resolveCollision(pos.x + dx, pos.z)) {
      pos.x += dx;
    } else {
      this.velocity.x = 0;
    }
    if (!this._resolveCollision(pos.x, pos.z + dz)) {
      pos.z += dz;
    } else {
      this.velocity.z = 0;
    }
  }

  dispose() {
    document.removeEventListener("pointerlockchange", this._onPointerLockChange);
    document.removeEventListener("pointerlockerror", this._onPointerLockError);
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("keyup", this._onKeyUp);
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener("mousemove", this._onDragMove);
    document.removeEventListener("mouseup", this._onDragEnd);
    this.domElement.removeEventListener("mousedown", this._onMouseDown);
  }
}
