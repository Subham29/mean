import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  pageOptions = [1, 2, 5, 10, 20, 50, 100];
  pageSize = 5;
  pageIndex = 1;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.isLoading = true;
    this.postsService.getPosts(this.pageIndex, this.pageSize);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.totalPosts = postData.maxPosts;
        this.isLoading = false;
      });
  }

  onPageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchPosts();
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(id: string) {
    this.postsService.deletePost(id).subscribe(responseData => {
      console.log(responseData.message);
      this.postsService.getPosts(this.pageIndex, this.pageSize);
    });;
  }
}
