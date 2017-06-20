import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule} from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from './../environment/firebase/config';
import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { StorageProvider } from '../providers/storage/storage';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
    AngularFireModule.initializeApp(environment.firebaseConfig),  // imports firebase/app needed for everything
    AngularFireAuthModule,  // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule,  // imports firebase/database, only needed for database features
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [ MyApp ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    UserProvider,
    StorageProvider
  ]
})
export class AppModule {}
