
export const PageBuilderHeader = ({ actions, children }) => {
    console.log('Header', actions, children);

    return (
        <>
            {/* {actions} */}
            {children}
        </>
    )
}