import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SharedServiceService } from './components/shared-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent {
  title = 'Demo-crud';
  showLoader = false
  loaderSubscription = new Subscription()

  constructor(
    public sharedService: SharedServiceService
    
  ) {

  }

  ngOnInit() {
    
    this.loaderSubscription = this.sharedService.loaderState$.subscribe((state: any) => {
      this.showLoader = state;
    });
    


  }

  ngOnDestroy() {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }

}
