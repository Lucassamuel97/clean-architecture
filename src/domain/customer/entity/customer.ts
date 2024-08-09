import Entity from "../../@shared/entity/entity.abstract";
import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";
import NotificationError from "../../@shared/notification/notification.error";
import { CustomerAddressChangedEvent } from "../event/customer-changed-address.event";
import { CustomerCreatedEvent } from "../event/customer-created.event";
import CustomerValidatorFactory from "../factory/customer.validator.factory";
import Address from "../value-object/address";

export default class Customer extends Entity {
  private _name: string;
  private _address!: Address;
  private _active: boolean = true;
  private _rewardPoints: number = 0;

  private eventDispatcher: EventDispatcherInterface;

  constructor(id: string, name: string) {
    super();
    this._id = id;
    this._name = name;
    this.validate();
  }

  static create(id: string, name: string, eventDispatcher: EventDispatcherInterface): Customer {
    const customer = new Customer(id, name);
    customer.eventDispatcher = eventDispatcher;
    customer.raiseEvent(new CustomerCreatedEvent(id, name));
    return customer;
  }

  private raiseEvent(event: any) {
    this.eventDispatcher?.notify(event);
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  isActive(): boolean {
    return this._active;
  }

  validate(){
    CustomerValidatorFactory.create().validate(this);   
    
    if(this.notification.hasErrors()){
      throw new NotificationError(this.notification.getErrors());
    }
  }

  set name(name: string) {
    this._name = name;
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;
    this.raiseEvent(new CustomerAddressChangedEvent(this.id, this.name, address));
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  set Address(address: Address) {
    this._address = address;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }
}