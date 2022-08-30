import { LightningElement,  wire, track, api} from 'lwc';
import getAssessments from '@salesforce/apex/AssessmentController.getAssessments';

const COLUMNS = [
    {label: 'Assessment Name', fieldName: 'AssessmentName', sortable:"true"},
    {label: 'Competency', fieldName: 'CompetencyName', sortable:"true"},
    {label: 'Employee Evaluation', fieldName: 'Employee_Evaluation__c', sortable:"true"},
    {label: 'Peer Evaluation', fieldName: 'Peer_Evaluation__c', sortable:"true"},
    {label: 'Expected Level', fieldName: 'Expected_Proficiency_Level__c', sortable:"true"},
    {label: 'Proficiency Gap', fieldName: 'Proficiency_Gap__c', sortable:"true"}
]

export default class ViewAssessmentFlowComponent extends LightningElement {

    @api recordId;

    error;
    assessments;
    columns = COLUMNS;
    @track sortBy;
    @track sortDirection;

    connectedCallback(){
        console.log('im here!');
    }

    @wire(getAssessments, {recordId:'$recordId'})
    wiredAssessments({error, data}){
        if(data){
            console.log(`recordId = ${this.recordId}`);
            let currentData = [];

            data.forEach((row) => {

                let rowData = {};

                rowData.Employee_Evaluation__c = row.Employee_Evaluation__c;
                rowData.Expected_Proficiency_Level__c = row.Expected_Proficiency_Level__c;
                rowData.Peer_Evaluation__c = row.Peer_Evaluation__c;
                rowData.Proficiency_Gap__c = row.Proficiency_Gap__c;

                if (row.Assessment__c) {
                    rowData.AssessmentName = row.Assessment__r.Name;
                }

                if (row.Competency__c) {
                    rowData.CompetencyName = row.Competency__r.Name;
                }

                currentData.push(rowData);
                console.log(`${JSON.stringify(rowData)}`);
            });



            this.assessments = currentData;
            this.error = undefined;
        }
        else if (error) {
            console.log(`error: ${JSON.stringify(error)}`);
            this.error = error;
            this.record = undefined;
        }
    }
    
    //Sorting by column logic
    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.assessments));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.assessments = parseData;
    }    

    
    
}