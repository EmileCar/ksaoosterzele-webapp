import { useCallback, useState } from "react";
import Button from "../../../components/button/Button";
import SectionTitle from "../../../components/sectionTitle/SectionTitle";
import { getCollages } from "../../../services/mediaService";
import useFetch from "../../../hooks/useFetch";
import Collage from "../../../types/Collage";
import FetchedDataLayout from "../../../layouts/FetchedDataLayout";
import MediaItemPopup from "../../../components/collages/popups/CollagePopup";
import CollageGalleryItemAdmin from "../../../components/collages/gallery/CollageGalleryItemAdmin";

const MediaAdmin = () => {
  const fetchCollages = useCallback(() => getCollages(true), []);
  const { pending, data: collages, error, refetch } = useFetch(fetchCollages);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const closeHandler = () => {
    refetch();
    setShowCreatePopup(false);
  }

  return (
    <>
      <div className="admin__top">
        <SectionTitle title="Media beheren">
          <p>Maak hier nieuwe collages aan of pas bestaande collages aan.</p>
        </SectionTitle>
      </div>
      <div className="collages__container">
        <div className="admin__actions">
          <Button text="+ Collage toevoegen" onClick={() => setShowCreatePopup(true)} hover/>
        </div>
        <FetchedDataLayout isPending={pending} error={error}>
          {collages && collages.length === 0 && (
            <p>
              Er zijn nog geen collages aangemaakt.
            </p>
          )}
          <div className={`collage_gallery`}>
            {collages &&
              collages.map((collage) => (
                <CollageGalleryItemAdmin key={collage.id} collage={collage} reload={refetch}/>
              ))}
          </div>
        </FetchedDataLayout>
        {showCreatePopup && <MediaItemPopup onClose={closeHandler} />}
      </div>
    </>
  );
};

export default MediaAdmin;