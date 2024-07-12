import React, { useEffect, useState } from "react";
import Event, { SendEvent } from "../../../types/Event";
import useForm from "../../../hooks/useForm";
import { formatDateToInputDateTime, isDateTimeInPast } from "../../../utils/datetimeUtil";
import Popup from "../../popup/Popup";
import Label from "../../form/Label";
import Input from "../../form/Input";
import { getImagePaths, sendEvent } from "../../../services/eventService";
import Checkbox from "../../form/Checkbox";
import FetchedDataLayout from "../../../layouts/FetchedDataLayout";
import Button from "../../button/Button";
import Form from "../../form/Form";
import Group from "../../form/Group";
import AutoComplete from "../../form/AutoComplete";
import { usePopupContext } from "../../../contexts/PopupContext";
import useFetch from "../../../hooks/useFetch";

const EventPopup = ({ event, onClose } : { event?: Event | null | undefined, onClose: () => void }) => {
    const { values, errorStates, setErrors, handleValueChange, changeValue } = useForm<SendEvent>(new SendEvent(event || {}));
    const { pending, data: fetchedImagePaths, error } = useFetch<string[]>(getImagePaths);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [imagePaths, setImagePaths] = useState<string[]>([]);
    const [imagePathError, setImagePathError] = useState<string>("");
	const { closePopup } = usePopupContext();

    const handleSubmitForm = async () => {
        setIsPending(true);
        setErrors(null);
        await sendEvent(values, event ? "PUT" : "POST").then(() => {
            setIsPending(false);
            onClose();
            closePopup();
        }).catch((errors: any) => {
            setTimeout(() => {
                let errorfields = errors.errorFields ?? {};
                errorfields.imgpathError = imagePathError;
                errorfields.general = errors.message;
                setErrors(errorfields);
                setIsPending(false);
            }, 800)
        });
    }

    const handleCalendarChange = (e: any) => {
        const datetime = new Date(e.target.value);
        changeValue("datetime", datetime);
    }

    useEffect(() => {
        if(fetchedImagePaths) {
            setImagePaths(fetchedImagePaths);
        }
    }, [fetchedImagePaths]);

    const search = async (e: any) => {
        if(!fetchedImagePaths) return;
        setImagePaths(e.query ? fetchedImagePaths.filter((path) => path.toLowerCase().includes(e.query.toLowerCase())) : fetchedImagePaths);
    }

    return (
        <Popup title={event ? `${event.name} aanpassen` : "Nieuw evenement"}>
            <FetchedDataLayout isPending={isPending} error={errorStates.general}>
                {isDateTimeInPast(values.datetime as Date) && (<p className="error" style={{ marginBottom: "1rem" }}>Deze activiteit is in het verleden</p>)}
                <Form>
                    <Group>
                        <Label text="Naam" errorMessage={errorStates.nameError}>
                            <Input type={"text"} name="name" value={values.name} onChange={handleValueChange} focus />
                        </Label>
                        <Label text="Locatie" errorMessage={errorStates.locationError}>
                            <Input type={"text"} name="location" value={values.location} onChange={handleValueChange}/>
                        </Label>
                    </Group>
                    <Group>
                        <Label text="Datum & tijd" errorMessage={errorStates.datetimeError}>
                            <Input name="datetime" type="datetime-local" value={formatDateToInputDateTime(values.datetime as Date)} onChange={handleCalendarChange} />
                        </Label>
                        <Label text="Afbeelding (path)" errorMessage={errorStates.imgpathError}>
                            <AutoComplete value={values.imageFileName} suggestions={imagePaths} completeMethod={search} onChange={handleValueChange} name="imagePaths" dropdown noSuggestionsMessage={pending ? "Nog bezig me laden..." : "Geen afbeeldingen gevonden"} />
                        </Label>
                    </Group>
                    <Label text="Beschrijving" errorMessage={errorStates.descriptionError} customClassName="flex-column">
                        <textarea
                            className="input"
                            onChange={handleValueChange}
                            name="description"
                            value={values.description ?? ""}
                        />
                    </Label>
                    <Group>
                        <Label text="URL" errorMessage={errorStates.urlError}>
                            <Input type="text" name="url" value={values.url} onChange={handleValueChange} />
                        </Label>
                        <div className="form-group__half">
                            <Label text="Prijs" errorMessage={errorStates.entryPriceError}>
                                <Input type="string" name="entryPrice" value={values.entryPrice} onChange={handleValueChange} />
                            </Label>
                            <Label text="Featured?" customClassName="flex-column">
                                <Checkbox name="featured" checked={values.featured} onChange={(e) => changeValue("featured", e.target.checked)} />
                            </Label>
                        </div>
                    </Group>
                    <Button text="Opslaan" onClick={handleSubmitForm} darken uppercase/>
                </Form>
            </FetchedDataLayout>
        </Popup>
    )
};

export default EventPopup;