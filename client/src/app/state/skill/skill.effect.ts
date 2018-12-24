import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  CreateSkill,
  SkillActionTypes,
  CreateSkillSuccess,
  CreateSkillFail,
  DeleteSkill,
  DeleteSkillSuccess,
  DeleteSkillFail,
  WatchSkill,
  WatchSkillFail,
  UpdateSkill
} from '../skill/skill.action';
import { concatMap, catchError, map } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { Skill } from '../../../app/models/skill';
import { AuthEffects } from '../auth/auth.effect';
import { pickOnce } from '../book/book.effect';

@Injectable()
export class SkillEffects {
  constructor(
    private authEffects: AuthEffects,
    private actions$: Actions,
    private afFunctions: AngularFireFunctions,
    private afFirestore: AngularFirestore
  ) {}

  @Effect()
  watchSkill: Observable<Action> = this.actions$.pipe(
    ofType<WatchSkill>(SkillActionTypes.WatchSkill),
    concatMap(() =>
      this.authEffects.forAuthenticated.pipe(
        concatMap(uid =>
          this.afFirestore
            .collection<Skill>('skills', ref => ref.where('uid', '==', uid))
            .valueChanges()
            .pipe(map(skills => new UpdateSkill(skills)))
        )
      )
    ),
    catchError(e => of(new WatchSkillFail(e)))
  );

  @Effect()
  createSkill: Observable<Action> = this.actions$.pipe(
    ofType<CreateSkill>(SkillActionTypes.CreateSkill),
    concatMap(async action => {
      const uid = await pickOnce(this.authEffects.forAuthenticated);
      await this.afFunctions
        .httpsCallable('createSkill')({
          isbn: action.isbn,
          content: action.content,
          uid
        })
        .toPromise();
      console.log(`Created skill: ${action.content}`);
      return new CreateSkillSuccess();
    }),
    catchError(() => of(new CreateSkillFail()))
  );

  @Effect()
  deleteSkill: Observable<Action> = this.actions$.pipe(
    ofType<DeleteSkill>(SkillActionTypes.DeleteSkill),
    concatMap(async action => {
      await this.afFunctions
        .httpsCallable('deleteSkill')({
          isbn: action.skill.isbn,
          content: action.skill.content,
          uid: action.skill.uid
        })
        .toPromise();
      console.log(`Deleted skill: ${action.skill.content}`);
      return new DeleteSkillSuccess();
    }),
    catchError(() => of(new DeleteSkillFail()))
  );
}
