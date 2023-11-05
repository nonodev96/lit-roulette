import { css } from 'lit';

export const litRouletteStyles = css`
  .wheel-container,
  .wheel-base,
  .wheel-base-container,
  .wheel-base-indicator {
    font-family: Ubuntu, sans-serif;
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
    content: '';
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
    text-align: center;
  }

  .wheel-base-container .wheel-base-indicator:before {
    content: '';
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
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    border-radius: 50%;
    background-image: linear-gradient(
      to left,
      black 33%,
      rgba(255, 255, 255, 0) 0%
    );
    background-position: bottom;
    background-size: 3px 1px;
    -webkit-mask: radial-gradient(circle, transparent 65%, #000 66%);
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
