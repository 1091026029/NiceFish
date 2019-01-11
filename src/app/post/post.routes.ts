import { PostDetailMainComponent } from './post-detail-main/post-detail-main.component';
import { PostlistComponent } from './postlist/postlist.component';
import { WritePostComponent } from '../post/write-post/write-post.component';

export const postRoutes = [
	{
		path: '',
		redirectTo: 'page/1',
		pathMatch: 'full'
	},
	{
		path: 'page/:page',
		component: PostlistComponent
	},
	{
		path: 'post-detail/:id',
		component: PostDetailMainComponent
	},
	{
		path: 'write',
		component: WritePostComponent
	},
];