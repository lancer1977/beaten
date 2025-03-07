//function containsDebug(input: string): boolean {
//  return input.includes('debug');

import { Params } from "@angular/router";
import { PolyEnv } from "../models/polyenv";

//}
export class QueryExtensions{
    public static Exists(pram:Params, key:string): boolean
    {
        var result = pram[key] ;
        console.log('key: ' + key + ' Value:' + result);
        return (result !== undefined)
    }
    public static GetBool( pram:Params, key:string, def: boolean = true ) : boolean
    {
        if(!QueryExtensions.Exists(pram,key)) return def;
        return pram[key] == "true";
    } 

    public static GetString( pram:Params, key:string , def: string = '') : string
    {
        if(!QueryExtensions.Exists(pram,key)) return def;
        return pram[key] ;
    } 

    public static GetInt( pram:Params, key:string, def: number = 0 ) : number
    {       
        if(!QueryExtensions.Exists(pram,key)) return def;
        return parseInt(pram[key]);
    } 

    public static GetEnv(pram:Params){
        var result = pram['env'];
        switch (result) {
            case "dev":
              return PolyEnv.Dev;
            case "debug":
              return PolyEnv.Debug; 
            default:
                return PolyEnv.Prod; 
          }
    }
}