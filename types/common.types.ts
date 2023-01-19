interface BaseActivity {
  start: string;
  end: string;
}

export type ApiResponseError = {
  error: string;
};

export enum ActivityTypeEnum {
  pool,
  rock,
  climb,
}

export type Activity = BaseActivity &
  (
    | { type: ActivityTypeEnum.pool; poolId: string }
    | { type: ActivityTypeEnum.rock }
    | { type: ActivityTypeEnum.climb }
  );
