import { Component, HostListener, ElementRef, Renderer, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { SignInService } from './user/sign-in/sign-in.service';
import { SignUpService } from './user/sign-up/sign-up.service';
import { User } from './user/model/user-model';
import { merge } from 'rxjs'
import { MessageService } from 'primeng/api';

@Component({
	selector: 'root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public currentUser: User;
	private globalClickCallbackFn: Function;

	constructor(
		public elementRef: ElementRef,
		public renderer: Renderer,
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public translate: TranslateService,
		public signInService: SignInService,
		public signUpService: SignUpService,
		private messageService: MessageService
	) {

	}

	ngOnInit() {
		this.globalClickCallbackFn = this.renderer.listen(this.elementRef.nativeElement, 'click', (event: any) => {
			console.log("全局监听点击事件>" + event);
		});

		this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

		merge(this.signInService.currentUser, this.signUpService.currentUser)
			.subscribe(
				data => {
					this.currentUser = data;
					let activatedRouteSnapshot: ActivatedRouteSnapshot = this.activatedRoute.snapshot;
					let routerState: RouterState = this.router.routerState;
					let routerStateSnapshot: RouterStateSnapshot = routerState.snapshot;

					console.log(activatedRouteSnapshot);
					console.log(routerState);
					console.log(routerStateSnapshot);

					//如果是从/signin这个URL进行的登录，跳转到首页，否则什么都不做
					if (routerStateSnapshot.url.indexOf("/signin") != -1) {
						this.router.navigateByUrl("/home");
					}
				},
				error => console.error(error)
			);

		//ngx-translate国际化服务相关的配置
		this.translate.addLangs(["zh", "en"]);
		this.translate.setDefaultLang('zh');
		const browserLang = this.translate.getBrowserLang();
		console.log("获取到浏览器的语言>" + browserLang);
		this.translate.use(browserLang.match(/zh|en/) ? browserLang : 'zh');
	}

	ngOnDestroy() {
		if (this.globalClickCallbackFn) {
			this.globalClickCallbackFn();
		}
	}

	toggle(button: any) {
		console.log(button);
	}

	public doLogout(): void {
		this.signInService.logout();
		this.messageService.add({ severity: 'danger', summary: 'Success Message', detail: '退出成功' });
		this.router.navigateByUrl("");
	}

	public gotoWrite(): void {
		//TODO：如果没有登录，跳转到登录页，如果已登录，跳往写作页
		this.router.navigateByUrl("user/write");
	}
}