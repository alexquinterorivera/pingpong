import { Component, OnInit } from '@angular/core';
import {DataService } from '../../providers/data.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  name:string;
  age:number;
  email:string;
  address: Address;
  hobbies: any[];
  posts: Post[];
  isEdit:boolean = false;

  constructor(private dataService: DataService) {
    console.log('constructor ran');

  }

  ngOnInit() {
    console.log('ngOnInit ran')
    this.name = "John Doe";
    this.age = 30;
    this.email = "Alexquintero@ghmail.com";
    this.address = {
      street: "Jan Wiegerssstraat",
      city: "Almere",
      state: "Flevoland"
    }
    this.hobbies = ["Knitting","Sitting","Witting"];

    this.dataService.getPosts().subscribe((posts) => {
      this.posts = posts;
    });

  }

  onClick(){
    this.name = "Gone Shoo";
    this.hobbies.push('New Hobby');
  }

  addHobby(hobby){
    console.log(hobby);
    this.hobbies.unshift(hobby);
    return false;
  }

  deleteHobby(hobby){
    for(let i = 0; i<this.hobbies.length;i++){
      if(this.hobbies[i] == hobby){
        this.hobbies.splice(i,1);
      }
    }
    return false;
  }
  
  toggleEdit(){
    this.isEdit = !this.isEdit;
  }
}


interface Address {
  street: string,
  city: string,
  state: string,
}

interface Post{
  id: number,
  title: string,
  body: string,
  userId: number
}