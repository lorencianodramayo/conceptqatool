import React, { FC } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

//components
import ImageSelect from './ImageSelect';
import NormalText from './NormalText';
import TextOptions from './TextOptions';
import TextSelect from './TextSelect';


const DrawerElement: FC = () => {
    const templates = useSelector((state: RootStateOrAny) => state.playground.value);

    return <React.Fragment>
        {
            Object.keys(templates.selected).sort().map((data: any) => {

                if (["image",
                    "logo",
                    "img",
                    "background",
                    "roundel",
                    "video",
                    "audio",
                    "packshot",
                ].some((t) => templates.selected[data].toLowerCase().includes(t))) {
                    return <ImageSelect key={data} />
                } else {
                    if (
                        [
                            "text",
                            "disclaimer",
                            "legal",
                            "headline",
                            "price",
                            "currency",
                        ].some((t) => templates.selected[data].toLowerCase().includes(t))
                    ) {
                        return !templates.selected[data].toLowerCase().includes("color") ?
                            (
                                <TextOptions label={templates.selected[data]} key={data} />
                            )
                            : (
                                <NormalText label={templates.selected[data]} key={data} />
                            )
                    } else {
                        return templates.selectedPV !== undefined ?
                            (
                                typeof templates.selectedPV[templates.selected[data]] !== 'undefined' ||
                                    templates.selectedPV[templates.selected[data]] !== undefined ?
                                    <TextSelect label={templates.selected[data]} options={templates.selectedPV[templates.selected[data]]} key={data} /> : <NormalText label={templates.selected[data]} key={data} />

                            ) :
                            (
                                <NormalText
                                    label={templates.selected[data]}
                                    key={data}
                                />
                            )
                    }
                }

            })
        }
    </React.Fragment>
}

export default DrawerElement;