import { EnviaConsoleLog1Handler } from "../../customer/event/handler/log1-console-when-customer-is-created.handler";
import { EnviaConsoleLog2Handler } from "../../customer/event/handler/log2-console-when-customer-is-created.handler";
import { EnviaConsoleLogHandler } from "../../customer/event/handler/send-log-console-when-customer-change-address.handler";
import EventDispatcher from "./event-dispatcher";
import Customer from "../../customer/entity/customer";
import Address from "../../customer/value-object/address";
import { CustomerCreatedEvent } from "../../customer/event/customer-created.event";
import { CustomerAddressChangedEvent } from "../../customer/event/customer-changed-address.event";

describe("Customer Domain events tests", () => {

    it("should register event handlers and trigger events", () => {
        const eventDispatcher = new EventDispatcher();

        const eventLog1 = new EnviaConsoleLog1Handler();
        const eventLog2 = new EnviaConsoleLog2Handler();
        const eventChangedAddress = new EnviaConsoleLogHandler();
       
        eventDispatcher.register('CustomerCreatedEvent', eventLog1);
        eventDispatcher.register('CustomerCreatedEvent', eventLog2);
        eventDispatcher.register('CustomerAddressChangedEvent', eventChangedAddress);

        const customer = Customer.create('1', 'John Doe', eventDispatcher);

        const address = new Address("Main Street", 123, "12345678", "Palmital");
        customer.changeAddress(address);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toEqual(
            expect.arrayContaining([eventLog1, eventLog2])
        );

        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toEqual(
            expect.arrayContaining([eventChangedAddress])
        );
    });

    it("should trigger CustomerCreatedEvent and CustomerAddressChangedEvent", () => {
        const eventDispatcher = new EventDispatcher();

        const eventLog1 = new EnviaConsoleLog1Handler();
        const eventLog2 = new EnviaConsoleLog2Handler();
        const eventChangedAddress = new EnviaConsoleLogHandler();

        const eventLog1Spy = jest.spyOn(eventLog1, 'handle');
        const eventLog2Spy = jest.spyOn(eventLog2, 'handle');
        const eventChangedAddressSpy = jest.spyOn(eventChangedAddress, 'handle');
       
        eventDispatcher.register('CustomerCreatedEvent', eventLog1);
        eventDispatcher.register('CustomerCreatedEvent', eventLog2);
        eventDispatcher.register('CustomerAddressChangedEvent', eventChangedAddress);

        const customer = Customer.create('1', 'John Doe', eventDispatcher);
        const address = new Address("Main Street", 123, "12345678", "Palmital");
        customer.changeAddress(address);

        expect(eventLog1Spy).toHaveBeenCalled();
        expect(eventLog2Spy).toHaveBeenCalled();
        expect(eventChangedAddressSpy).toHaveBeenCalled();
    });

    it("should notify when CustomerCreatedEvent is triggered", () => {
        const eventDispatcher = new EventDispatcher();

        // Criando um Mock do Método notify:
        const notifySpy = jest.spyOn(eventDispatcher, 'notify');

        // Criando customer e disparando o CustomerCreatedEvent
        const customer = Customer.create('1', 'John Doe', eventDispatcher);

        // Verificando a Chamada do Método notify:
        expect(notifySpy).toHaveBeenCalledWith(expect.any(CustomerCreatedEvent));
    });

    it("should notify when CustomerAddressChangedEvent is triggered", () => {
        const eventDispatcher = new EventDispatcher();

        // Criando um Mock do Método notify:
        const notifySpy = jest.spyOn(eventDispatcher, 'notify');

        // Criando customer e disparando o CustomerAddressChangedEvent
        const customer = Customer.create('1', 'John Doe', eventDispatcher);
        const address = new Address("Main Street", 123, "12345678", "Palmital");
        customer.changeAddress(address);

        // Verificando a Chamada do Método notify:
        expect(notifySpy).toHaveBeenCalledWith(expect.any(CustomerAddressChangedEvent));
    });
});