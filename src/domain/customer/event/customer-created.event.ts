import EventInterface from "../../@shared/event/event.interface";

export class CustomerCreatedEvent implements EventInterface {
    public readonly dataTimeOccurred: Date;
    public readonly eventData: { id: string, name: string };

    constructor(id: string, name: string) {
        this.dataTimeOccurred = new Date();
        this.eventData = { id, name };
    }
}