import {Wallet, APIUserMoney, APIUserWallet, APIJobs, JobTypes, JobsStats, JobStats} from "./interfaces";
import axios from "axios";

const baseURL = "https://apiv1.skylord.fr/api/";

/**
 * Vous permet de récupérer la monnaie d'un joueur avec son pseudo.
 *
 * @param pseudo pseudo minecraft du joueur.
 * @param devise si vous voulez la devise avec la monnaie (false par défaut)
 */
export function getMoney(pseudo: string, devise: boolean = false): Promise<string> {
    if (!pseudo) throw new Error("Veuillez spécifier un pseudo !")
    return new Promise((resolve, reject) => {
        axios.get(baseURL + `joueur/money?pseudo=${pseudo}`)
            .then(res => res.data).then((res: APIUserMoney) => devise ? resolve(res.Format + res.Devise) : resolve(res.Format))
            .catch(reject)
    })
}

/**
 * Vous permet de récupérer toute les informations sur les cryptomonnaies d'un joueur
 *
 * @param pseudo pseudo minecraft du joueur.
 */
export function getWallet(pseudo: string): Promise<Wallet> {
    if (!pseudo) throw new Error("Veuillez spécifier un pseudo !")
    return new Promise((resolve, reject) => {
        axios.get(baseURL + `joueur/wallet?pseudo=${pseudo}`)
            .then(res => res.data).then((res: APIUserWallet) => {
                resolve({
                    BTCUSTD: res.wallet[0].BTCUSTD,
                    ETHUSDT: res.wallet[1].ETHUSDT,
                    LTCUSDT: res.wallet[2].LTCUSDT,
                    BNBUSDT: res.wallet[3].BNBUSDT,
                    SHIBUSDT: res.wallet[4].SHIBUSDT,
                    DOGEUSDT: res.wallet[5].DOGEUSDT,
                    XRPUSDT: res.wallet[6].XRPUSDT,
                    ADAUSDT: res.wallet[7].ADAUSDT,
                    DOTUSDT: res.wallet[8].DOTUSDT,
                })
            })
            .catch(reject)
    })
}

/**
 * Vous permet de récupérer les informations sur un métier d'un joueur
 *
 * @param pseudo pseudo minecraft du joueur
 * @param job job que vous souhaitez récupérer.
 */
export function getJob(pseudo: string, job?: JobTypes): Promise<JobStats> {
    if (!pseudo) throw new Error("Veuillez spécifier un pseudo !")
    return new Promise((resolve, reject) => {
        axios.get(baseURL + `joueur/jobs?pseudo=${pseudo}&jobs=${job}`)
            .then(res => res.data)
            .then((res: APIJobs) => {
                if (res.Resultat == "404") reject("Le métier est introuvable !");
                if (res.Resultat == "998") reject("Le joueur n'est pas en ligne ou n'existe pas");
                resolve({
                    level: res.jobs[0].jlevel,
                    maxlevel: res.jobs[0].jmaxlvl,
                    exp: res.jobs[0].jexp,
                    maxexp: res.jobs[0].jmaxexp,
                })
            })
            .catch(reject)
    })
}

/**
 * Vous permet de récupérer les informations sur tout les métiers d'un joueur
 *
 * @param pseudo pseudo minecraft du joueur
 * @param job job que vous souhaitez récupérer.
 */
export function getJobs(pseudo: string): Promise<JobsStats> {
    if (!pseudo) throw new Error("Veuillez spécifier un pseudo !")
    return new Promise((resolve, reject) => {
        axios.get(baseURL + `joueur/jobs?pseudo=${pseudo}&jobs=all`)
            .then(res => res.data)
            .then((res: APIJobs) => {
                if (res.Resultat == "404") reject("Le métier est introuvable !");
                if (res.Resultat == "998") reject("Le joueur n'est pas en ligne ou n'existe pas");
                const jobs = ["mineur", "pecheur", "architecte", "chasseur", "bucheron", "aventurier"];
                let data: any = {};
                for (let i of [...Array(5).keys()]) {
                    data[jobs[i]] = {
                        level: res.jobs[i].jlevel,
                        maxlevel: res.jobs[i].jmaxlvl,
                        exp: res.jobs[i].jexp,
                        maxexp: res.jobs[i].jmaxexp,
                    }
                }
                resolve(data)
            })
            .catch(reject)
    })
}
