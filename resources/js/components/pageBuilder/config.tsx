import { Config, DropZone, PuckComponent } from "@measured/puck";
import { Card } from "antd/lib";
import { ReactElement, ReactNode } from "react";

type ComponentsProps = {};

type RootProps = {
    title: string;
    description: string;
}

type DrawerItem = {
    el: (props) => ReactElement;
    name: string;
}
export type DrawerItemProps = {
    name: string;
    index: number;
    Children: PuckComponent;
}

export const DrawerItems: DrawerItem[] = [
    {
        name: 'HeadingBlock',
        el: (name) => (<h1>{`The Name is: ${name}`}</h1>)
    },
    {
        name: 'HeadingBlock1',
        el: (name) => (<h2>{`The Name is: ${name}`}</h2>)
    },
    {
        name: 'HeadingBlock2',
        el: (name) => (<h3 >{`The Name is: ${name}`}</h3>)
    },
];

const components = DrawerItems.reduce((acc, curr, i) => {
    acc[curr.name] = {
        fields: {
            title: {
                type: "text"
            }
        },
        defaultProps: {title: curr.name},
        render: ({title}) => curr.el(title)
    }
    return acc;
}, {});

// DrawerItems.forEach(item => {
//     components[item.name] = {
//         fields: {
//             title: {
//                 type: "text"
//             }
//         },
//         render: ({title}) => (item.el?.replace('%%', title))
//     }
// });

export const SampleConfig: Config<ComponentsProps, RootProps> = {
    components: components,
    // root: {
    //     fields: {
    //         title: {
    //             type: "text"
    //         },
    //         description: {
    //             type: "text"
    //         }
    //     },
    //     render: ({title, description}) => (
    //         <>
    //             <h1>{title}</h1>
    //             <p>{description}</p>
    //         </>
    //     )
    // }
    root: {
        defaultProps: {
            title: 'Default Title'
        }
    }
}
export const EditorConfig: Config<ComponentsProps, RootProps> = {
    components: {
        HeadingBlock: {
            fields: {
                title: {
                  type: "text",
                }
            },
            render: ({title}) => (<h1>{title}</h1>)
        },
        CardBlock: {
            fields: {
                title: {
                    type: "text",
                },
                bordered: {
                    type: "radio",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Right", value: "right" },
                    ],
                }
            },
            defaultProps: {
                bordered: "left",
            },
            render: ({title, bordered}) => (
                <>
                <Card
                    title={title}
                    bordered={bordered === "right"}
                />
                    <DropZone zone="NewZone" />
                </>
                )
        }
    },
    root: {
        // fields: {
        //     title: {
        //         type: "text",
        //     },
        //     description: {
        //         type: "textarea",
        //     }
        // },
        defaultProps: {
            title: ''
        }
        // render: ({Children, title, description}) => (
        //     <div>
        //         <h1>{title}</h1>
        //         <p>{description}</p>
        //         {Children}
        //     </div>
        // )
    }
};

