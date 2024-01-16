import { LightningElement, api, wire } from 'lwc';
import getLeaveRequests from '@salesforce/apex/LeaveRequstController.getLeaveRequests';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id  from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';

const COLUMNS = [
    {label : 'Request Id' , fieldName : 'Name' , cellAttributes:{class: {fieldName : 'cellClass'}}},
    {label : 'User' , fieldName : 'UserName' , cellAttributes:{class: {fieldName : 'cellClass'}}},
    {label : 'From Date' , fieldName : 'From_Date__c' , cellAttributes:{class: {fieldName : 'cellClass'}}},
    {label : 'To Date' , fieldName : 'To_Date__c' , cellAttributes:{class: {fieldName : 'cellClass'}}},
    {label : 'Reason' , fieldName : 'Reason__c' , cellAttributes:{class: {fieldName : 'cellClass'}}},
    {label : 'Status' , fieldName : 'Status__c' , cellAttributes:{class: {fieldName : 'cellClass'}}},
    {label : 'Manager Comment' , fieldName : 'Manager_Comment__c' , cellAttributes:{class: {fieldName : 'cellClass'}}},
    {type : "button" , typeAttributes : {
        label : 'Edit' , 
        name : 'Edit' , 
        title : 'Edit' , 
        value : 'edit' , 
        disabled : {fieldName: 'isEditDisabled'}
    },
      cellAttributes:{class: {fieldName : 'cellClass'}}
}
];

export default class leaveRequests extends LightningElement 
{
    columns = COLUMNS;

    leavesRequests = [];
    leavesRequestsWireResult;
    showModalPopup = false;
    objectApiName = 'LeaveRequest__c';
    recordId = '';
    currentUserId = Id;

    @wire(getLeaveRequests)
    wiredMyLeaves(result) 
    {
        this.leavesRequestsWireResult = result;
        if(result.data)
        {
            this.leavesRequests = result.data.map(a =>({
                ...a,
                UserName:a.User__r.Name,
                cellClass: a.Status_c == 'Approved' ? 'slds-theme_success' : a.Status_c == 'Rejected' ? 'slds-theme_warning' : '',
                isEditDisabled: a.Status__c != 'Pending'
            }));
        }
        if(result.error)
        {
            console.log('Error occured while fetching my leaves- ' , result.error);
        }
    }
    get noRecordsFound()
    {
        return this.leavesRequests.length == 0;
    }
    newRequestClickHandler(event)
    {
        this.showModalPopup = true;
        this.recordId = '';
    }
    popupCloseHandler(event)
    {
        this.showModalPopup = false;
    }
    rowActionHandler(event)
    {
        this.showModalPopup = true;
        this.recordId = event.detail.row.Id;
    }
    successHandler(event)
    {
        this.showModalPopup = false;
        this.showToast('Data Saved Successfully');
        this.refreshGrid();
    }

    @api
    refreshGrid(event)
    {
        refreshApex(this.leavesRequestsWireResult);
    }
    showToast(message, title = 'success', variant = 'success')
    {
        const event = new ShowToastEvent(
        {
            title,
            message,
            variant
        });
    }
}