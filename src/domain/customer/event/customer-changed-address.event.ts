import Address from "../value-object/address";
import EventInterface from "../../@shared/event/event.interface";

export class CustomerAddressChangedEvent implements EventInterface {
    public readonly dataTimeOccurred: Date;
    public readonly eventData: { id: string, name: string, address: Address };

    constructor(id: string, name: string, address: Address) {
        this.dataTimeOccurred = new Date();
        this.eventData = { id, name, address };
    }
}