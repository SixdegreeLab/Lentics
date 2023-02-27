import mixpanel from "mixpanel-browser";

enum TrackingEvents {
  SIGN_IN = "sign_in",
  SIGN_OUT = "sign_out",
  PAGE_VIEWED = "page_viewed",
}

export class MixpanelTracking {
  private static _instance: MixpanelTracking;

  public static getInstance(): MixpanelTracking {
    if (MixpanelTracking._instance == null) {
      return (MixpanelTracking._instance = new MixpanelTracking());
    }

    return this._instance;
  }

  public constructor() {
    if (MixpanelTracking._instance)
      throw new Error(
        "Error: Instance creation of MixpanelTracking not alowed. Use Mixpanel.getInstance() instead."
      );

    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_ID || "", {
      debug: false,
      ignore_dnt: false,
    });
  }

  protected track(name: string, data: object = {}): void {
    mixpanel.track(name, data);
  }

  public signIn(data: object = {}): void {
    this.track(TrackingEvents.SIGN_IN, data);
  }

  public signOut(data: object = {}): void {
    this.track(TrackingEvents.SIGN_OUT, data);
  }

  public pageViewed(data: object = {}): void {
    this.track(TrackingEvents.PAGE_VIEWED, data);
  }
}
