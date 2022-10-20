import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LeftComponent } from './left/left.component';
import { ToastComponent } from './toast/toast.component';
import { VerifyComponent } from './verify/verify.component';
import { AngularOtpLibModule } from 'angular-otp-box';
import { SocialLoginModule, AuthServiceConfig , FacebookLoginProvider, GoogleLoginProvider} from 'angularx-social-login';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { ActvityModalComponent } from './actvity-modal/actvity-modal.component';
import { WithdrawModalComponent } from './withdraw-modal/withdraw-modal.component';
import { DepositModalComponent } from './deposit-modal/deposit-modal.component';
import { ClaimModalComponent } from './claim-modal/claim-modal.component';
import { InviteModalComponent } from './invite-modal/invite-modal.component';
import { SwapComponent } from './swap/swap.component';
import { CovertGavModalComponent } from './covert-gav-modal/covert-gav-modal.component';
import { CovertGamModalComponent } from './covert-gam-modal/covert-gam-modal.component';
import { SellModalComponent } from './sell-modal/sell-modal.component';
import { BuyModalComponent } from './buy-modal/buy-modal.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { CategoryProposalsComponent } from './category-proposals/category-proposals.component';
import { NewProposalComponent } from './new-proposal/new-proposal.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ProposalDetailsComponent } from './proposal-details/proposal-details.component';
import { WalletComponent } from './wallet/wallet.component';
import { DepositComponent } from './deposit/deposit.component';
import { QRCodeModule } from 'angularx-qrcode';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { SuccessModalComponent } from './success-modal/success-modal.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { CommingSoonComponent } from './comming-soon/comming-soon.component';
import { DefiComponent } from './defi/defi.component';
import { NftsComponent } from './nfts/nfts.component';
import { VrworldComponent } from './vrworld/vrworld.component';
import { VideoComponent } from './video/video.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClipboardModule } from 'ngx-clipboard';

const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('970337446909843')
  },
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('996058836777-n5uvs6s60rli4taeq3gd9l81vb9dar94.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    LeftComponent,
    ToastComponent,
    VerifyComponent,
    ForgotPasswordComponent,
    ActvityModalComponent,
    WithdrawModalComponent,
    DepositModalComponent,
    ClaimModalComponent,
    InviteModalComponent,
    SwapComponent,
    CovertGavModalComponent,
    CovertGamModalComponent,
    SellModalComponent,
    BuyModalComponent,
    ProposalsComponent,
    CategoryProposalsComponent,
    NewProposalComponent,
    ProposalDetailsComponent,
    WalletComponent,
    DepositComponent,
    GamesComponent,
    GameComponent,
    SuccessModalComponent,
    ConfirmModalComponent,
    ProfileModalComponent,
    PageLoaderComponent,
    CommingSoonComponent,
    DefiComponent,
    NftsComponent,
    VrworldComponent,
    VideoComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularOtpLibModule,
    SocialLoginModule,
    ChartsModule,
    JwPaginationModule,
    QRCodeModule,
    SlickCarouselModule,
    ClipboardModule
  ],
  providers: [
    Title,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
