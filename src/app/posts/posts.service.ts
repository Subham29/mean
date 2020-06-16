import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Post } from "./post.model";
import { ThrowStmt } from "@angular/compiler";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], maxPosts: number}>();

  constructor(private http: HttpClient, public router: Router) {}

  getPosts(page: number, pageLimit: number) {
    const queryParams = `?page=${page}&pageLimit=${pageLimit}`;
    this.http
      .get<{message: string, posts: any, maxPosts: number}>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(map((postData) => {
        return { posts: postData.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe(postData => {
        console.log("Posts fetched successfully");
        this.posts = postData.posts;
        this.postsUpdated.next({posts: [...this.posts], maxPosts: postData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string, post: Post }>("http://localhost:3000/api/posts", postData)
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      })
  }

  deletePost(id: string) {
    return this.http.delete<{ message: string }>("http://localhost:3000/api/posts/"+id);
  }

  getPost(id: string) {
    return this.http.get<{post: any, message: string}>("http://localhost:3000/api/posts/"+id);
  }

  updatePost(id: string, title: string, content: string, image: string | File) {
    let postData: FormData | Post;
    if (typeof(image) === 'string') {
      postData = {
        title: title,
        content: content,
        id: id,
        imagePath: image
      };
    } else {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    }
    this.http.put<{ message: string}>("http://localhost:3000/api/posts/"+id, postData).subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

}
