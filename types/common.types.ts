interface BaseActivity {
  start: Date;
  end: Date;
}

export enum ActivityType {
  pool,
  rock,
  climb,
}

export type Activity = BaseActivity &
  (
    | { type: ActivityType.pool; poolId: string }
    | { type: ActivityType.rock }
    | { type: ActivityType.climb }
  );
