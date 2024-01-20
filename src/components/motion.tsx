import { motion } from "framer-motion";

const defaultMotion = {
    initialX: 0,
    initialY: 0,
    initialScale: 1,
    initialOpacity: 1,
    exitX: 0,
    exitY: 0,
    exitScale: 1,
    exitOpacity: 1,
    animateX: 0,
    animateY: 0,
    animateScale: 1,
    animateOpacity: 1,
    transitionType: "tween",
    transitionDuration: 0.2,
}

interface Motion {
    children: React.ReactNode,
    initialX?: number,
    initialY?: number,
    initialScale?: number,
    initialOpacity?: number,
    exitX?: number,
    exitY?: number,
    exitScale?: number,
    exitOpacity?: number,
    animateX?: number,
    animateY?: number,
    animateScale?: number,
    animateOpacity?: number,
    transitionType?: string,
    transitionDuration?: number,
}

const Motion = ({
    children,
    initialX=defaultMotion.initialX,
    initialY=defaultMotion.initialY,
    initialScale=defaultMotion.initialScale,
    initialOpacity=defaultMotion.initialOpacity,
    exitX=defaultMotion.exitX,
    exitY=defaultMotion.exitY,
    exitScale=defaultMotion.exitScale,
    exitOpacity=defaultMotion.exitOpacity,
    animateX=defaultMotion.animateX,
    animateY=defaultMotion.animateY,
    animateScale=defaultMotion.animateScale,
    animateOpacity=defaultMotion.animateOpacity,
    transitionType=defaultMotion.transitionType,
    transitionDuration=defaultMotion.transitionDuration,
}: Motion) => (
    <motion.div
        initial={{
            x: initialX,
            y: initialY,
            scale: initialScale,
            opacity: initialOpacity
        }}
        animate={{
            x: animateX,
            y: animateY,
            scale: animateScale,
            opacity: animateOpacity
        }}
        exit={{
            x: exitX,
            y: exitY,
            scale: exitScale,
            opacity: exitOpacity
        }}
        transition={{
            type: transitionType,
            duration: transitionDuration,
        }}
    >
        {children}
    </motion.div>
);

export default Motion;