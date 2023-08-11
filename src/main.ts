import * as CONFIG from './config'
import * as PIXI from 'pixijs'

const app = new PIXI.Application()
document.body.appendChild(app.view as any)

type Vector = { x: number, y: number }

class SoulWorld {
  static instance: SoulWorld
  static create() {
    SoulWorld.instance = new SoulWorld()
  }

  souls: Soul[] = []

  private constructor() {
    for (let i = 0; i < 10; i++) {
      this.souls.push(new Soul())
    }
    app.ticker.add(this.update)
  }

  update() {
    this.souls.forEach(soul => {
      soul.update()
    })
  }
}

type SoulState {
  visibleSouls: Soul[] = []
  position: Vector = { x: 0, y: 0 }
  velocity: Vector = { x: 0, y: 0 }
}

class Soul {
  color = 0xff0000


  private _state: SoulState
  private _nextState: SoulState

  private _circle: PIXI.Graphics
    
  constructor() {
    this._state = {
      position: { 
        x: Math.floor(Math.random() * app.renderer.width)
        y: Math.floor(Math.random() * app.renderer.height)
      },
      velocity: { x: 0, y: 0 },
      visibleSouls: []
    }

    
    this._circle = new PIXI.Graphics()
    this._circle.beginFill(this.color)
    this._circle.drawCircle(0, 0, 5)

    app.stage.addChild(this.circle)
  }

  next() {
    const nextState =  new SoulState()
    nextState.position.x = this._state.position.x + this._state.velocity.x
    nextState.position.y = this._state.position.y + this._state.velocity.y

  }
  
  update() {

  }

}

abstract class SoulCommand {
  
  constructor(public target: Soul){
  }

  async abstract execute(): Promise<void>
}

class ChangeVelocity implements SoulCommand {
  constructor(
    public target: Soul,
    public desiredVelcity: Vector
  ) { }

  async execute(): Promise<void> {
    this.target.velocity = this.desiredVelcity
  }

}

SoulWorld.create()