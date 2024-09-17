import {Timestamp } from 'firebase/firestore';

export interface CourseData {
    cN: string;          // courseName: 授業科目名
    cNE?: string;        // courseNameEnglish: 授業科目名（英語表記、任意）
    ins: string;         // instructor: 担当教員名
    dpt: string;         // department: 科目開講学部・学科
    sCat: string;        // subjectCategory: 科目分類
    sCls?: string;       // subjectClassification: 科目区分（任意）
    tYr: string;         // targetYear: 対象学年
    sched: string;       // schedule: 授業のスケジュール情報（例：曜日・時間割）
    fmt: string;         // format: 授業の形式（例：講義、演習、実習）
    rCode: string;       // registrationCode: 履修コード
    crd: string;         // credits: 授業の単位数
    note: string;        // notes: 備考
    sUrl: string;        // syllabusUrl: シラバスのURL
    trm?: string;        // term: 開講学期（前学期、後学期など、任意）
    dWk?: string;        // dayOfWeek: 授業の曜日（任意）
    prd?: string;        // period: 授業の時限（任意）
    loc?: string;        // location: 教室の場所（任意）
    cAt?: Timestamp;     // createdAt: データが登録された日時
  }
  