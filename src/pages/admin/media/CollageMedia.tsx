import { useParams } from "react-router-dom";
import "./Media.css"
import SectionTitle from "../../../components/sectionTitle/SectionTitle";
import { useCallback, useRef, useState } from "react";
import { getCollage, uploadImages } from "../../../services/mediaService";
import useFetch from "../../../hooks/useFetch";
import Label from "../../../components/form/Label";
import ImageList from "../../../components/collages/ImageList";
import FetchedDataLayout from "../../../layouts/FetchedDataLayout";
import Form from "../../../components/form/Form";
import Button from "../../../components/button/Button";

const CollageMedia = () => {
    const { id } = useParams();
    const fetchCollage = useCallback(() => getCollage(id as unknown as number), [id]);
    const { pending, data: collage, error } = useFetch(fetchCollage);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [totalSize, setTotalSize] = useState(0);
    const [uploadingError, setUploadingError] = useState<string | null>(null);
    const [uploadingSuccess, setUploadingSuccess] = useState<boolean>(false);
    const [uploadingPending, setUploadingPending] = useState<boolean>(false);

    const handleFileInputChange = (e: any) => {
        const files = e.target.files;
        setTotalSize(calculateTotalSize(files));
    };

    const calculateTotalSize = (files : any) => {
        let total = 0;
        for (let i = 0; i < files.length; i++) {
            total += files[i].size;
        }
        return total;
    };

    const uploadImagesFunc = async () => {
        if(fileInputRef.current){
            setUploadingError(null);
            setUploadingPending(true);
            const selectedFiles = fileInputRef.current.files;
            await uploadImages(collage?.id!, selectedFiles!).then(() => {
                setUploadingSuccess(true);
                setUploadingError(null);
            }).catch((error) => {
                setUploadingError(error.message)
            })
            setUploadingPending(false);
        }
    }

    return (
        <>
            <SectionTitle title={collage?.displayName || "Collage media"} fullWidth>
                <p>Voeg fotos toe of pas de collage van inhoud aan.</p>
                <p>Klik op een foto om een detail te zien en om die te kunnen verwijderen.</p>
                <p><strong>Let op! </strong>Het is beter om een grote hoeveelheid foto's rechtstreeks naar de file manager te uploaden ipv ze hier te uploaden. Probeer hier max 15MB en max 20 fotos up te loaden per keer.</p>
            </SectionTitle>
            <FetchedDataLayout isPending={pending} error={error}>
                {collage &&
                    <>
                        <Form customClassName="upload-form">
                            {uploadingSuccess && <p className="success">Uploaden gelukt!</p>}
                            {uploadingError && <p className="error">{uploadingError}</p>}
                            <Label text={`Voeg afbeeldingen toe`} errorMessage={""}>
                                <input ref={fileInputRef} style={{cursor: "pointer"}} type="file" name="images" accept="image/*,video/mp4,video/x-m4v,video/*" multiple className="input inherit-font" onChange={handleFileInputChange} />
                            </Label>
                            {totalSize > 0 && (
                                <>
                                    {uploadingPending ? <p>Bezig met {(totalSize / (1024 * 1024)).toFixed(2)} MB te uploaden...</p> : <p>Te uploaden grootte: {(totalSize / (1024 * 1024)).toFixed(2)} MB</p>}
                                    <Button text="Uploaden" onClick={() => uploadImagesFunc()} darken disabled={uploadingPending} pending={uploadingPending}/>
                                </>
                            )}
                        </Form>
                        <ImageList collage={collage} images={collage.images!} isAdmin/>
                    </>
                }
            </FetchedDataLayout>
        </>

    );
}

export default CollageMedia;