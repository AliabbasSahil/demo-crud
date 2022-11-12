export class BasicInfo {
    first_name: string;
    last_name: string;
    email:string;    
    constructor(obj? : { first_name: string;
    last_name: string;
    email:string;    } | undefined) {
        this.first_name = obj ? obj.first_name : '';
        this.last_name = obj ? obj.last_name : '';
        this.email = obj ? obj.email : '';     
    }
}