import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { VerifyComponent } from './verify/verify.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SwapComponent } from './swap/swap.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { CategoryProposalsComponent } from './category-proposals/category-proposals.component';
import { ProposalDetailsComponent } from './proposal-details/proposal-details.component';
import { WalletComponent } from './wallet/wallet.component';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { CommingSoonComponent } from './comming-soon/comming-soon.component';
import { DefiComponent } from './defi/defi.component';
import { NftsComponent } from './nfts/nfts.component';
import { VrworldComponent } from './vrworld/vrworld.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
    data : {title:'Login | Gamrevv'}
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    data : {title:'Sign-Up | Gamerevv'}
  },
  {
    path: 'home',
    component: HomeComponent,
    data : {title:'Gamrevv | The new way to play on the blockchain'}
  },
  {
    path: 'verify',
    component: VerifyComponent,
    data : {title:'Verfy | Gamerevv'}
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data : {title:'Forgot Password | Gamerevv'}
  },
  {
    path: 'swap',
    component: SwapComponent,
    data : {title:'Swap | Gamerevv'}
  },
  {
    path: 'proposals',
    component: ProposalsComponent,
    data : {title:'Proposals | Gamerevv'}
  },
  {
    path: 'proposal-detail/:id',
    component: ProposalDetailsComponent,
    data : {title:'Vote | Gamerevv'}
  },
  {
    path: 'games',
    component: GamesComponent,
    data : {title:'Games | Gamerevv'}
  },
  {
    path: 'game/:id',
    component: GameComponent,
    data : {title:'Game | Gamerevv'}
  },
  {
    path: 'category/:id',
    component: CategoryProposalsComponent,
    data : {title:'Category | Gamerevv'}
  },
  {
    path: 'wallet',
    component: WalletComponent,
    data : {title:'Wallet | Gamerevv'}
  },
  {
    path: 'comming-soon',
    component: CommingSoonComponent,
    data : {title:'Comming Soon | Gamerevv'}
  },
  {
    path: 'defi',
    component: DefiComponent,
    data : {title:'Defi | Gamerevv'}
  },
  {
    path: 'nfts',
    component: NftsComponent,
    data : {title:'NFTS | Gamerevv'}
  },
  {
    path: 'vrworld',
    component: VrworldComponent,
    data : {title:'VR WORLD | Gamerevv'}
  },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
