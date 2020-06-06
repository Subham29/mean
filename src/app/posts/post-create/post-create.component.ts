import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Post } from "../post.model";

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

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe((response) => {
          console.log(response.message);
          if (response.post) {
            this.post = {id: response.post._id, title: response.post.title, content: response.post.content};
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

  constructor(public postsService: PostsService, private route: ActivatedRoute, public router: Router) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post = {
      id: this.postId,
      title: form.value.title,
      content: form.value.content
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(post);
    } else {
      this.postsService.updatePost(post);
    }
    form.resetForm();
    this.router.navigate(["/"]);
  }
}
