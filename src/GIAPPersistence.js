/** Store properties:
 *    lib
 *    lib_version
 *    distinct_id
 *    device_id
 *    initial_referrer
 *    initial_referring_domain
 *    queue
 */
import DeviceInfo from './utils/deviceInfo';

export default class GIAPPersistence {
  props = {
    queue: [],
  }

  constructor(name) {
    // this.name: store storage name from config
    this.name = name;

    // load persisted data from localStorage
    this.update({
      ...this.load(),
    });
  }

  // register a set of super-props then persist the changes
  // this will overwrite previous super property values
  update = (props) => {
    // update this.props with props
    this.props = {
      ...this.props,
      ...props,
    };
    // save the changes to localStorage
    this.persist();
  }

  updateReferrer = (referrer) => {
    if (this.props.initialReferrer) return;
    this.update({
      initialReferrer: referrer || '$direct',
      initialReferringDomain: DeviceInfo.getReferringDomain(referrer) || '$direct',
    });
    // save the changes to localStorage
    this.persist();
  }

  updateQueue = (request) => {
    this.update({ queue: [...this.getQueue(), request] });
  }

  getDistinctId = () => this.props.distinctId;

  getQueue = () => this.props.queue;

  getPersistedProps = () => {
    const { queue, ...props } = this.props;
    return props;
  }

  persist = () => {
    localStorage.setItem(this.name, JSON.stringify(this.props));
  }

  load = () => {
    try {
      return JSON.parse(localStorage.getItem(this.name));
    } catch {
      return null;
    }
  }

  dequeue = () => (this.props.queue.length
    ? this.props.queue.shift()
    : null);

  peek = () => (this.props.queue.length
    ? this.props.queue[0]
    : null);
}
