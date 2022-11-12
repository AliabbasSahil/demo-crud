import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { EmployeeCols } from '../main';
import { BasicInfo } from '../main.model';
import { SharedServiceService } from '../shared-service.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.css']
})
export class MainComponentComponent implements OnInit {
  
  totalRecords = 0
  rowCount = 10;
  employees : any [] = []
  cols = EmployeeCols
  page : number = 1
  pageSize : number = 10
  employeeData : BasicInfo
  isSubmitted = false
  editModal = false
  id = null
  deleteModal = false
  selectedData : any

  constructor(
    public sharedService : SharedServiceService,
    public messageService : MessageService
  ) {
    this.employeeData = new BasicInfo()
   }

  ngOnInit(): void {
    this.getAllTableData(this.page,this.pageSize);
  }

  loadEmployees(event: LazyLoadEvent) {
    this.page = ((event.first?event.first : 0 ) / (event.rows?event.rows:0)) + 1;
    this.pageSize = event.rows ? event.rows : this.pageSize;
    this.getAllTableData(this.page,this.pageSize);
  }

  openModal(){
    this.isSubmitted = false
    this.employeeData = new BasicInfo()
    this.editModal = true
  }

  getAllTableData(page:number,size:number){
    this.sharedService.updateLoader(true)
    this.sharedService.getAllTableData(page,size).subscribe((response:any) => {
      this.employees = response.data.map(((el:any,i:number) => ({
       sNo : i+1,
       fName : el.first_name,
       lName : el.last_name,
       email : el.email,
       id: el.id
      }) ) )
      this.totalRecords = response.total
      this.sharedService.updateLoader(false)
    },(error:any) => {
      this.sharedService.updateLoader(false)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error ? error?.error?.message : 'Something went wrong' });
    } )
  }

  addCustomer(form:any){
    if (form.submitted) {
      this.isSubmitted = true
    }
    if (form.form.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail : 'Please Enter all mandatory fields.' });
      return
    }else{
      const dataToSend = JSON.parse(JSON.stringify(this.employeeData))

      if(this.id){
        this.sharedService.updateLoader(true)
       this.sharedService.updateTableUser(dataToSend,this.id).subscribe((res:any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Employee updated successfully.` });
        this.editModal = false
        this.id = null
        this.getAllTableData(this.page,this.pageSize);
        this.sharedService.updateLoader(false)
      },(error:any) => {
      this.sharedService.updateLoader(false)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error ? error?.error?.message : 'Something went wrong' });
    } )
      }else{
        this.sharedService.updateLoader(true)
      this.sharedService.createTableUser(dataToSend).subscribe((res:any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Employee added successfully.` });
        this.editModal = false
        this.getAllTableData(this.page,this.pageSize);
        this.sharedService.updateLoader(false)
      },(error:any) => {
      this.sharedService.updateLoader(false)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error ? error?.error?.message : 'Something went wrong' });
    } )
    }
    }
  }

  getDataById(id:any){
    this.sharedService.updateLoader(true)
    this.sharedService.getTableDataById(id).subscribe((response:any) => {
      this.isSubmitted = false
      this.editModal = true
      this.id = id
      this.employeeData = new BasicInfo(response.data)
      this.sharedService.updateLoader(false)
    },(error:any) => {
      this.sharedService.updateLoader(false)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error ? error?.error?.message : 'Something went wrong' });
    } )
  }

  deleteEmployee(id:any){
    this.sharedService.updateLoader(true)
    this.sharedService.deleteTableUser(id).subscribe((response:any) => {
      this.deleteModal = false
      this.getAllTableData(this.page,this.pageSize);   
      this.sharedService.updateLoader(false)
    },(error:any) => {
      this.sharedService.updateLoader(false)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error ? error?.error?.message : 'Something went wrong' });
    } )
  }

}
