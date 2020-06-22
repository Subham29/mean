import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  mode: string = 'create';
  private postId: string = null;
  post: any;
  isLoading: boolean = false;
  form: FormGroup;
  imageSelected: boolean = false;
  imageUrl: string;

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)], updateOn:'blur'}),
      content: new FormControl(null, {validators: [Validators.required], updateOn:'blur'}),
      image: new FormControl(null, {validators: Validators.required, asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe((response) => {
          console.log(response.message);
          if (response.post) {
            this.imageSelected = true;
            this.post = {id: response.post._id, title: response.post.title, content: response.post.content, imagePath: response.post.imagePath, creator: response.post.creator};
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
            this.imageUrl = this.post.imagePath;
          }
        });
      } else {
        this.postId = null;
        this.mode = 'create';
        this.isLoading = false;
        this.imageSelected = false;
        this.imageUrl = "";
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if(file === undefined) {
      this.imageSelected = false;
      this.form.patchValue({
        image: null
      });
      return;
    }
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    this.imageSelected = true;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imageUrl = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
  }

  constructor(public postsService: PostsService, private route: ActivatedRoute) {}

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    // let loop_var = 0;
    // const intervalId = setInterval(() => {
    //   if (loop_var === 100) {
    //     clearInterval(intervalId);
    //     this.form.reset();
    //   }
    //   this.postsService.addPost(this.form.value.title+" "+loop_var, this.form.value.content, this.form.value.image);
    //   loop_var += 1;
    // }, 1000);
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }
}
