import { LightningElement } from 'lwc';

export default class LeaveTracker extends LightningElement 
{
    refreshleaverequestsHandler(event)
    {
        this.refs.myLeavesComp.refreshGrid();
    }
}