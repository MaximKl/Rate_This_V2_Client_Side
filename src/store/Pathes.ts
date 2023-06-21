import { Developer } from '../interfaces/product/addProduct/Developer';

const mainPath = 'http://localhost:9999';
const publicPath = '/RateThis/public';
const domain = '/RateThis';
class Pathes {
  static get mainPath() {
    return mainPath;
  }
  static get publicPath() {
    return publicPath;
  }
  static get domain() {
    return domain;
  }
  static getErrorCode(response: any) {
    if ('status' in response) {
      const errorCode: string | number = response.status;
      return errorCode as number;
    }
    return 0;
  }

  static mapParser = (data: Map<string, Developer[]>) => {
    var devMap: Map<string, Developer[]> = new Map();
    data &&
      Object.entries(data).forEach(
        ([role, [...devs]]: [role: string, devs: Developer[]]) => {
          devMap.set(role, devs);
        }
      );
    return devMap;
  };

  static pathParser = (path: string) => {
    if (path.split('_')[1]) {
      return Number.parseInt(path.split('_')[1]) !== undefined
        ? Number.parseInt(path.split('_')[1])
        : 0;
    } else {
      return 0;
    }
  };
}

export { Pathes };
