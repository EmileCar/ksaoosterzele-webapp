import React, { useCallback, useEffect, useState } from "react";
import Event, { SendEvent } from "../../../types/Event";
import useForm from "../../../hooks/useForm";
import { convertInputDateToDatabaseDate, formatDateToInputDateTime, isDateTimeInPast } from "../../../utils/datetimeUtil";
import Popup from "../../popup/Popup";
import Label from "../../form/Label";
import Input from "../../form/Input";
import { AutoComplete } from 'primereact/autocomplete';
import { getImagePaths, sendEvent } from "../../../services/eventService";
import Checkbox from "../../form/Checkbox";
import FetchedDataLayout from "../../../layouts/FetchedDataLayout";
import useFetch from "../../../hooks/useFetch";

const EventPopup = ({ event, onClose } : { event: Event | null | undefined, onClose: () => void }) => {
    const { values, errorStates, setErrors, handleValueChange, changeValue } = useForm<SendEvent>(new SendEvent(event || {}));
    const [isPending, setIsPending] = useState<boolean>(false);
    const [imagePaths, setImagePaths] = useState<string[]>([]);
    const [imagePathError, setImagePathError] = useState<string>("");
    
    const handleSubmitForm = async () => {
        setIsPending(true);
        setErrors(null);
        await sendEvent(values, event ? "PUT" : "POST").then(() => {
            setIsPending(false);
            onClose();
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

    const search = (event: any) => {
        getImagePaths().then((data) => {
            setImagePaths(event.query ? data.filter((path) => path.toLowerCase().includes(event.query.toLowerCase())) : data);
        });
    }

    useEffect(() => {
        console.log(errorStates)
    }, [errorStates])

    return (
        <Popup title={event ? `${event.name} aanpassen` : "Nieuw evenement"} onClose={onClose}>
            <FetchedDataLayout isPending={isPending} error={errorStates.general}>
                {isDateTimeInPast(values.datetime as Date) && (<p className="error" style={{ marginBottom: "1rem" }}>Deze activiteit is in het verleden</p>)}
                <form className="eventForm form">
                    <div className="form-group">
                        <Label text="Naam" errorMessage={errorStates.nameError}>
                            <Input type={"text"} name="name" value={values.name} onChange={handleValueChange} focus />
                        </Label>
                        <Label text="Locatie" errorMessage={errorStates.locationError}>
                            <Input type={"text"} name="location" value={values.location} onChange={handleValueChange}/>
                        </Label>
                    </div>
                    <div className="form-group">
                        <Label text="Datum & tijd" errorMessage={errorStates.datetimeError}>
                            <Input name="datetime" type="datetime-local" value={formatDateToInputDateTime(values.datetime as Date)} onChange={handleCalendarChange} />
                        </Label>
                        <Label text="Afbeelding (path)" errorMessage={errorStates.imgpathError}>
                            <AutoComplete className="input-wrapper" inputClassName="input" value={values.imageFileName} placeholder="afbeeldingNaam.jpeg" suggestions={[]} completeMethod={search} onChange={(e) => changeValue("imageFileName", e.target.value)} name="imgpath" dropdown/>
                        </Label>
                    </div>
                    <Label text="Beschrijving" errorMessage={errorStates.descriptionError} customClassName="flex-column">
                        <textarea
                            className="input"
                            onChange={handleValueChange}
                            name="description"
                            value={values.description}
                        />
                    </Label>
                    <div className="form-group">
                        <Label text="URL" errorMessage={errorStates.urlError}>
                            <Input type="text" name="url" value={values.url} onChange={handleValueChange} />
                        </Label>
                        <div className="form-group__half">
                            <Label text="Prijs" errorMessage={errorStates.entryPriceError}>
                                <Input type="string" name="entryPrice" value={"€ " + (values.entryPrice ?? "...")} onChange={handleValueChange} />
                            </Label>
                            <Label text="Featured?" customClassName="flex-column">
                                <Checkbox name="featured" checked={values.featured} onChange={(e) => changeValue("featured", e.target.checked)} />
                            </Label>
                        </div>
                    </div>
                    <button className="submit-button button inherit-font" onClick={handleSubmitForm}>
                        Save
                    </button>
                </form>
            </FetchedDataLayout>
        </Popup>
    )
};

export default EventPopup;