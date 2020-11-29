import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'searchPosts'
})
export class SearchPipe implements PipeTransform {
  transform(posts: string[], search = ''): string[] {
    if (!search.trim()) {
      return posts;
    }

    return posts.filter(post => {
      return post.toLowerCase().includes(search.toLowerCase());
    });
  }
}
