import { Drawer, Puck } from "@measured/puck"
import { DrawerItemProps, DrawerItems } from "../config"

// const drawerChildren: DrawerItemProps[] = DrawerItems.map((item, i) => {
//     return {
//         name: item.name,
//         index: i,
//         children: item.children
//     }
// });
export const PageBuilderDrawer = (props) => {
    return (
        <Drawer {...props}>
            {/* {DrawerItems.map((Item, i) => {
                return (
                    <Drawer.Item
                        name={Item.name}
                        index={i}
                        key={i}
                        children={(props) => Item.el(Item.name)}
                    />
                    
                )
            })} */}
        </Drawer>
    )
}