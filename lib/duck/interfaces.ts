import { DuckOptions } from './index';
import { COMBINE_REDUCERS } from './Duck';
import { Reducer } from 'redux';

export type TYPES<T> = { readonly [P in keyof T]: string };

export type GLOBAL_SELECTOR<T> = T extends (state: any, ...rest: infer U) => infer K
    ? (globalState: any, ...rest: U) => K
    : never;
export type GLOBAL_SELECTORS<T> = { [key in keyof T]: GLOBAL_SELECTOR<T[key]> };

export type DuckType<T extends Duck> = { new(options?: DuckOptions): T };
export type DUCKS_REDUCERS<T extends Record<string, Duck>> = {
    [key in keyof T]: T[key]['reducer']
};
export type DUCKS<T extends Record<string, DuckType<Duck>>> = {
    [key in keyof T]: InstanceType<T[key]>
};

export interface Duck {
    quickTypes: any;
    rawTypes: any;
    types: TYPES<this['quickTypes']> & this['rawTypes'];
    reducer: Reducer;
    reducers: any;
    State: ReturnType<this['reducer']>;
    selector: (globalState: any) => this['State'];
    selectors: GLOBAL_SELECTORS<this['rawSelectors']>;
    rawSelectors: any;
    localSelectors: this['rawSelectors'];
    creators: any;
    saga: () => Generator
}

export interface ComposableDuck extends Duck {
    quickDucks: any
    rawDucks: any
    ducks: DUCKS<this['quickDucks']> & this['rawDucks']
    reducer: COMBINE_REDUCERS<this['reducers'] & DUCKS_REDUCERS<this['ducks']>>
}
