import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentTableService } from './comment-table-mng.service';
import { flyIn } from '../../shared/animations/fly-in';

@Component({
  selector: 'comment-table-mng',
  templateUrl: './comment-table-mng.component.html',
  styleUrls: ['./comment-table-mng.component.scss'],
  animations: [
    flyIn
  ]
})
export class CommentTableComponent implements OnInit {
  public loading: boolean = true;
  public currentPage: number = 1;
  public totalRecords: number = 11;
  public commentList: Array<any> = [];

  constructor(public router: Router,
    public activeRoute: ActivatedRoute,
    public commentTableService: CommentTableService) {

  }

  ngOnInit() {
    this.activeRoute.params.subscribe(
      (params) => {
        this.currentPage = parseInt(params["page"]);
        this.getCommentByUserIdAndPaging();
      }
    );
  }

  public getCommentByUserIdAndPaging(): void {
    this.loading = true;
    let userId = JSON.parse(window.localStorage.getItem("currentUser")).id;
    this.commentTableService.getCommentByUserIdAndPaging(this.currentPage, userId).subscribe(
      (res) => {
        this.commentList = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public onPage(event: any): void {
    this.currentPage = parseInt((event.first / event.rows) + "") + 1;
    this.router.navigateByUrl(`/manage/comment-table/page/${this.currentPage}`);
  }

  public delComment(commentId: Number): void {
    console.log(commentId);
  }
}
