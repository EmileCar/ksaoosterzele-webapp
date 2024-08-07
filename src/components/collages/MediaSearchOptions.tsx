import Label from "../form/Label";
import Input from "../form/Input";
import Form from "../form/Form";
import Group from "../form/Group";
import { useCollageContext } from "../../contexts/CollageContext";

const MediaSearchOptions = () => {
    const { searchValue, setSearchValue, sortedBy, setSortedBy, groupBy, setGroupBy, showSearchOptions } = useCollageContext();

    const sortOptions = [
        { label: 'Recentste eerst', value: 'recent' },
        { label: 'Oudste eerst', value: 'oldest' },
        { label: 'Naam A-Z', value: 'name' },
        { label: 'Naam Z-A', value: 'name_desc' }
    ];

    const groupOptions = [
        { label: 'Geen', value: 'none' },
        { label: 'Type', value: 'type' },
        { label: 'Datum', value: 'date' },
    ];

    return (
        <div className="media__search-options">
            <Form customClassName={`filter-media-form ${showSearchOptions ? "show" : ""}`}>
                <Group>
                    <Label text="Zoeken">
                        <Input type="search" name={"search"} placeholder="Zoeken..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                    </Label>
                    <Label text="Sorteer op">
                        <select className="input inherit-font" value={sortedBy} onChange={(e) => setSortedBy(e.target.value)}>
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </Label>
                    <Label text="Groepeer op">
                        <select className="input inherit-font" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                            {groupOptions && groupOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </Label>
                </Group>
            </Form>
        </div>
    );
}

export default MediaSearchOptions;