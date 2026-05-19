import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { Observer } from "gsap/Observer";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, Flip, CustomEase, Observer);

  // Named eases used across the app
  CustomEase.create("luxe", "0.7, 0, 0.2, 1");
  CustomEase.create("silk", "0.83, 0, 0.17, 1");
  CustomEase.create("slowReveal", "0.16, 1, 0.3, 1");

  gsap.defaults({ ease: "luxe", duration: 0.7 });
  registered = true;
}

export { gsap, ScrollTrigger, Flip };
