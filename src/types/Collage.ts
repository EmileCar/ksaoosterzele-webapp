import CollageType from "./CollageType";

class Collage {
    id: number | null;
    displayName: string;
    name: string;
    description: string;
    date: Date | null;
    active: boolean;
    types: CollageType[];
    images: string[] | null;

    constructor(collageData?: any) {
        this.id = collageData.id || null;
        this.displayName = collageData.display_name || null;
        this.name = collageData.internal_name || null;
        this.description = collageData.description || null;
        this.date = collageData.date ? new Date(collageData.date) : null;
        this.active = collageData.active || false;
        this.types = collageData.types && collageData.types.map((type: any) => new CollageType(type)) || [];
        this.images = collageData.images ?? null;
    }
}

class SendCollage {
    id: number | null;
    name: string;
    description: string;
    date: Date | null;
    active: boolean;
    types: number[];

    constructor(collageData?: any) {
        this.id = collageData.id || null;
        this.name = collageData.displayName || null;
        this.description = collageData.description || null;
        this.date = collageData.date ? new Date(collageData.date) : null;
        this.active = collageData.active || false;
        this.types = collageData.types && collageData.types.map((type: CollageType) => type.id) || [];
    }
}

export default Collage;
export { SendCollage };