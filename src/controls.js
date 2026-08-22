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
    this.enabled = false;

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

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onPointerLockChange = this._onPointerLockChange.bind(this);

    document.addEventListener("pointerlockchange", this._onPointerLockChange);
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("keyup", this._onKeyUp);

    this.onLockChange = null; // callback(locked: boolean)
  }

  get object() {
    return this.yawObject;
  }

  lock() {
    this.domElement.requestPointerLock();
  }

  unlock() {
    document.exitPointerLock();
  }

  _onPointerLockChange() {
    this.enabled = document.pointerLockElement === this.domElement;
    if (this.enabled) {
      document.addEventListener("mousemove", this._onMouseMove);
    } else {
      document.removeEventListener("mousemove", this._onMouseMove);
      this.keys.forward = this.keys.back = this.keys.left = this.keys.right = false;
    }
    if (this.onLockChange) this.onLockChange(this.enabled);
  }

  _onMouseMove(e) {
    const sensitivity = 0.0022;
    this.yawObject.rotation.y -= e.movementX * sensitivity;
    this.pitchObject.rotation.x -= e.movementY * sensitivity;
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
    if (!this.enabled) return;
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
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("keyup", this._onKeyUp);
    document.removeEventListener("mousemove", this._onMouseMove);
  }
}
