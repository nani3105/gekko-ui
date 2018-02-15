import { Vue } from 'vue-property-decorator';
import { Mixin } from 'vue-mixin-decorator';
import { post } from '@/helpers//ajax';
import * as moment from 'moment';

@Mixin
export class Dataset extends Vue {
  public datasets: any[] = [];
  public datasetScanstate = 'idle';
  public unscannableMakets = [];

  protected scan() {
    this.datasetScanstate = 'scanning';

    post('scansets', {}, (error, response) => {
      this.datasetScanstate = 'scanned';

      this.unscannableMakets = response.errors;
      let sets: any[] = [];

      response.datasets.forEach((market: any) => {
        market.ranges.forEach((range: any, i: number) => {
          sets.push({
            exchange: market.exchange,
            currency: market.currency,
            asset: market.asset,
            from: moment.unix(range.from).utc(),
            to: moment.unix(range.to).utc(),
            id: market.exchange + market.asset + market.currency + i,
          });
        });
      });

      // for now, filter out sets smaller than 3 hours..
      sets = sets.filter((set: any) => {
        if (set.to.diff(set.from, 'hours') > 2) {
          return true;
        }
      });

      sets = sets.sort((a, b) => {
        const adiff = a.to.diff(a.from);
        const bdiff = b.to.diff(b.from);

        if (adiff < bdiff) {
          return -1;
        }

        if (adiff > bdiff) {
          return 1;
        }

        return 0;
      }).reverse();

      this.datasets = sets;
    });
  }
}
