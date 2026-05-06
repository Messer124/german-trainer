export default function ProgressiveList({
    items,
    children,
    className,
    as: Component = "ul",
}) {
    return (
        <Component className={className}>
            {items.map((item, index) => children(item, index))}
        </Component>
    );
}
