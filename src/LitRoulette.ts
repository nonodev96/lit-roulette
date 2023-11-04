import { html, css, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { property } from 'lit/decorators.js';

export type Item_t = {
  id: number,
  background: string,
  textColor: string,
  htmlContent: string
}

export class LitRoulette extends LitElement {
  static styles = css`
  .wheel-container, .wheel-base, .wheel-base-container, .wheel-base-indicator {
    transition: transform 1s ease-in-out;
 }
  .wheel-container {
    position: relative;
    display: inline-block;
    overflow: hidden;
    border-radius: 50%;
    cursor: pointer;
 }
  .wheel-container-indicator:before {
    content: "";
    position: absolute;
    z-index: 4;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid black;
    transform: translateX(-50%);
 }
  .wheel-container.indicator-top {
    transform: rotate(0deg);
 }
  .wheel-container.indicator-right {
    transform: rotate(90deg);
 }
  .wheel-container.indicator-right .wheel-base {
    transform: rotate(-90deg);
 }
  .wheel-container.indicator-bottom {
    transform: rotate(180deg);
 }
  .wheel-container.indicator-bottom .wheel-base {
    transform: rotate(-180deg);
 }
  .wheel-container.indicator-left {
    transform: rotate(270deg);
 }
  .wheel-container.indicator-left .wheel-base {
    transform: rotate(-270deg);
 }
  .wheel-container-border {
    border: 8px solid black;
 }
  .wheel-container-shadow {
    box-shadow: 5px 5px 15px -5px #000;
 }
  .wheel-base-container {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    border: 5px solid black;
    transform: translate(-50%, -50%);
 }
  .wheel-base-container-shadow {
    box-shadow: 5px 5px 15px -5px #000;
 }
  .wheel-base-container .wheel-base {
    position: absolute;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: 50%;
 }
  .wheel-base-container .wheel-base-indicator {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
 }
  .wheel-base-container .wheel-base-indicator:before {
    content: "";
    position: absolute;
    z-index: 1;
    top: -20px;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid black;
    transform: translateX(-50%);
 }
  .wheel {
    background: white;
    border-radius: 50%;
    margin: auto;
    overflow: hidden;
 }
  .wheel.easing-ease {
    transition: transform cubic-bezier(0.65, 0, 0.35, 1);
 }
  .wheel.easing-bounce {
    transition: transform cubic-bezier(0.49, 0.02, 0.52, 1.12);
 }
  .wheel-border:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    border-radius: 50%;
    background-image: linear-gradient(to left, black 33%, rgba(255, 255, 255, 0) 0%);
    background-position: bottom;
    background-size: 3px 1px;
   /* background:linear-gradient(red,purple,orange);
    */
    -webkit-mask: radial-gradient(transparent 65%, #000 66%);
    mask: radial-gradient(transparent 65%, #000 66%);
 }
  .wheel-item {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 50%;
    transform-origin: 0% 100%;
    border: 1px solid black;
 }
  .wheel-item:nth-child(odd) {
    background-color: skyblue;
 }
  .wheel-item:nth-child(even) {
    background-color: pink;
 }
  .wheel .content {
    position: absolute;
    left: -100%;
    width: 200%;
    height: 200%;
    text-align: center;
    transform: skewY(30deg) rotate(0deg);
    padding-top: 20px;
 }
  .wheel .content.horizontal-content {
    left: initial;
    right: 100%;
    width: 50%;
    height: 250%;
    text-align: right;
 }
  .wheel .content.horizontal-content span {
    display: block;
    transform: rotate(270deg);
 }
  `;

  _handleClick = () => {
    this.items = [...this.items]
    console.log(this.items)
  }

  @property({ type: Array<Item_t> }) items = [];
  @property({ type: Object }) firstItemIndex = { value: 0 };
  @property({ type: Object }) wheelResultIndex = { value: null };
  @property({ type: Boolean }) centeredIndicator = false;
  @property({ type: String }) indicatorPosition = "top";
  @property({ type: Number }) size = 300;
  @property({ type: Boolean }) displayShadow = false;
  @property({ type: Number }) duration = 4;
  @property({ type: Number }) resultVariation = 0;
  @property({ type: String }) easing = "ease";
  @property({ type: Boolean }) counterClockwise = false;
  @property({ type: Boolean }) horizontalContent = false;
  @property({ type: Boolean }) displayBorder = false;
  @property({ type: Boolean }) displayIndicator = true;
  @property({ type: Boolean }) baseDisplay = false;
  @property({ type: Number }) baseSize = 100;
  @property({ type: Boolean }) baseDisplayShadow = false;
  @property({ type: Boolean }) baseDisplayIndicator = false;
  @property({ type: String }) baseBackground = "";

  randomIdRoulette = 0;
  itemSelected = null;
  processingLock = false;

  itemAngle = 0;
  startingAngle = 0;
  degreesVariation = 0;
  counterClockWiseOperator = 1;


  launchWheel() {
    if (this.processingLock && this.itemSelected != null) {
      return;
    }
    this.processingLock = true;
    let wheelResult;
    if (this.wheelResultIndex.value !== null) {
      wheelResult = this.wheelResultIndex.value % this.items.length;
    } else {
      wheelResult = Math.floor(Math.random() * this.items.length + 1) - 1;
    }
    const wheelElt = document.querySelector(`#wheel-container-${this.randomIdRoulette} .wheel`);
    this.itemSelected = this.items[wheelResult];
    const newTransformValue = `rotate(${this.counterClockWiseOperator * (360 * 3) +
      -(wheelResult) * this.itemAngle -
      this.itemAngle / 2 +
      this.degreesVariation
      }deg)`;
    // wheelElt.style.transform = newTransformValue;
    this.dispatchEvent(new CustomEvent('wheel-start', { detail: this.itemSelected }));

    /* wheelElt.style.transform = `rotate(${this.counterClockWiseOperator * (360 * 3) +
      -(wheelResult) * this.itemAngle -
      this.itemAngle / 2 +
      this.degreesVariation
      }deg)`;
    this.$emit("wheel-start", this.itemSelected);
     */
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    console.log(changedProperties);

    if (changedProperties.has('items') && changedProperties.get("items") !== undefined) {
      this.itemAngle = 360 / this.items.length;
    }
    if (changedProperties.has('firstItemIndex')) {
      this.startingAngle = this.centeredIndicator
        ? -this.firstItemIndex.value * this.itemAngle - this.itemAngle / 2
        : -this.firstItemIndex.value * this.itemAngle;
    }
    if (changedProperties.has('resultVariation')) {
      if (!this.resultVariation) {
        this.degreesVariation = 0;
      } else {
        const minDegreesVariation =
          (((this.itemAngle / 2) * this.resultVariation) / 100) * -1;
        const maxDegreesVariation =
          ((this.itemAngle / 2) * this.resultVariation) / 100;
        // Calcular un valor aleatorio entre min y max de la variación de grados
        this.degreesVariation = Number(
          (
            Math.random() * (maxDegreesVariation - minDegreesVariation) +
            minDegreesVariation
          ).toFixed(2)
        );
      }
    }
    if (changedProperties.has('counterClockwise')) {
      this.counterClockWiseOperator = this.counterClockwise ? -1 : 1;
    }
  }

  reset() {
    this.itemSelected = null;
    /*
    document
      .querySelector(`#wheel-container-${this.randomIdRoulette} .wheel`)
      .style
      .transform = `rotate(${this.startingAngle}deg)`;
      */
  }

  render() {
    console.log(this)

    const indicator = this.baseDisplayIndicator ? html`<div class="wheel-base-indicator"></div>` : ''

    return html`
<div 
  id="wheel-container-${this.randomIdRoulette}" 
  class="wheel-container
  ${classMap({
      'indicator-top': this.indicatorPosition === 'top',
      'indicator-right': this.indicatorPosition === 'right',
      'indicator-bottom': this.indicatorPosition === 'bottom',
      'indicator-left': this.indicatorPosition === 'left',
      'wheel-container-indicator': this.displayIndicator,
      'wheel-container-shadow': this.displayShadow,
      'wheel-container-border': this.displayBorder,
    })}">
    
    <!-- BASE WHEEL -->
    ${this.baseDisplay
        ? html`
          <div 
            class="wheel-base-container
            ${classMap({ 'wheel-base-container-shadow': this.baseDisplayShadow })}"
            style=${styleMap({
          width: `${this.baseSize}px`,
          height: `${this.baseSize}px`,
          background: this.baseBackground,
        })}>
            <div class="wheel-base">
              <slot name="baseContent"></slot>
            </div>
            ${indicator}
          </div>`
        : ''}

    <!-- WHEEL -->
    <div class="wheel
      ${classMap({
          'easing-ease': this.easing === 'ease',
          'wheel-border': this.displayBorder
        })}"
      style=${styleMap({
          width: `${this.size}px`,
          height: `${this.size}px`,
          transitionDuration: `${this.duration}s`,
          transform: `rotate(${this.startingAngle}deg)`,
        })}>
      ${repeat<Item_t>(
          this.items,
          (item) => item.id,
          (item, index) => html`
          <div class="wheel-item"
            style=${styleMap({
            transform: `rotate(${this.itemAngle * index}deg) skewY(${-90 - this.itemAngle}deg)`,
            background: item.background,
          })}>
            <div class="content
              ${classMap({ 'horizontal-content': this.horizontalContent })}"
              style=${styleMap({
            transform: `skewY(${90 - this.itemAngle}deg) rotate(${this.itemAngle / 2}deg)`,
          })}>
              <span style=${styleMap({ color: item.textColor })}>${unsafeHTML(item.htmlContent)}</span>
            </div>
          </div>
        `
        )}
    </div>
  </div>
  <button @click="${this._handleClick}">click</button>
    `;
  }
}
