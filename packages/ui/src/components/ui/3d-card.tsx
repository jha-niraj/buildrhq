"use client";

import { cn } from "../../lib/utils"

import React, {
	createContext,
	useState,
	useContext,
	useRef,
	useEffect,
} from "react";

const MouseEnterContext = createContext<
	[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const CardContainer = ({
	children,
	className,
	containerClassName,
}: {
	children?: React.ReactNode;
	className?: string;
	containerClassName?: string;
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isMouseEntered, setIsMouseEntered] = useState(false);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;
		const { left, top, width, height } =
			containerRef.current.getBoundingClientRect();
		const x = (e.clientX - left - width / 2) / 25;
		const y = (e.clientY - top - height / 2) / 25;
		containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
	};

	const handleMouseEnter = () => {
		setIsMouseEntered(true);
		if (!containerRef.current) return;
	};

	const handleMouseLeave = () => {
		if (!containerRef.current) return;
		setIsMouseEntered(false);
		containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
	};
	return (
		<MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
			<div
				className={cn(
					"py-20 flex items-center justify-center",
					containerClassName
				)}
				style={{
					perspective: "1000px",
				}}
			>
				<div
					ref={containerRef}
					onMouseEnter={handleMouseEnter}
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
					className={cn(
						"flex items-center justify-center relative transition-all duration-200 ease-linear",
						className
					)}
					style={{
						transformStyle: "preserve-3d",
					}}
				>
					{children}
				</div>
			</div>
		</MouseEnterContext.Provider>
	);
};

export const CardBody = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				"h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
				className
			)}
		>
			{children}
		</div>
	);
};

// Extends HTMLAttributes rather than declaring a `[key: string]` catch-all. The
// catch-all actively broke typing here: `keyof` on an index-signature type is
// `string | number`, so forwardRef's internal `Omit<P, 'ref'>` collapsed every
// explicit prop back into the index type - `className` came out as `unknown` and
// could not even be passed to cn(). HTMLAttributes gives className, children and
// the standard DOM props with none of that.
interface CardItemProps extends React.HTMLAttributes<HTMLElement> {
	as?: React.ElementType;
	translateX?: number | string;
	translateY?: number | string;
	translateZ?: number | string;
	rotateX?: number | string;
	rotateY?: number | string;
	rotateZ?: number | string;
}

export const CardItem = React.forwardRef<HTMLElement, CardItemProps>(({
	as: Tag = "div",
	children,
	className,
	translateX = 0,
	translateY = 0,
	translateZ = 0,
	rotateX = 0,
	rotateY = 0,
	rotateZ = 0,
	...rest
}, forwardedRef) => {
	const localRef = useRef<HTMLElement>(null);
	const ref = forwardedRef || localRef;
	const [isMouseEntered] = useMouseEnter();

	const handleAnimations = React.useCallback(() => {
		const element = typeof ref === 'function' ? null : ref?.current;
		if (!element) return;
		if (isMouseEntered) {
			element.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
		} else {
			element.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
		}
	}, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ, ref]);

	useEffect(() => {
		handleAnimations();
	}, [handleAnimations]);

	const Component = Tag as React.ElementType;

	return (
		<Component
			ref={ref}
			className={cn("w-fit transition duration-200 ease-linear", className)}
			{...rest}
		>
			{children}
		</Component>
	);
});

CardItem.displayName = "CardItem";

// Create a hook to use the context
export const useMouseEnter = () => {
	const context = useContext(MouseEnterContext);
	if (context === undefined) {
		throw new Error("useMouseEnter must be used within a MouseEnterProvider");
	}
	return context;
};