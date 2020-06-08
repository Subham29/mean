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
  post: Post;
  isLoading: boolean = false;
  form: FormGroup;
  imageSelected: boolean = false;
  imageUrl: string;

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: Validators.required, asyncValidators: [mimeType]})
    });
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe((response) => {
          console.log(response.message);
          if (response.post) {
            this.imageSelected = true;
            this.post = {id: response.post._id, title: response.post.title, content: response.post.content};
            this.form.setValue({
              title: this.post.title,
              content: this.post.content
            });
          }
          this.isLoading = false;
        });
      } else {
        this.postId = null;
        this.mode = 'create';
        this.isLoading = false;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
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

  constructor(public postsService: PostsService, private route: ActivatedRoute, public router: Router) {}

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    const post = {
      id: this.postId,
      title: this.form.value.title,
      content: this.form.value.content
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(post);
    } else {
      this.postsService.updatePost(post);
      this.router.navigate(["/"]);
    }
    this.form.reset();
  }
}
