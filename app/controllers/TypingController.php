<?php

class TypingController extends BaseController {

  public function getChapterList(){
  	$books= Book::find(1);
  	return Response::json($books->getBooks());
  }

  public function getTopicList(){
    $currentchapterid = Session::get('chapterid');
    $currentchapter = Chapter::find($currentchapterid);
    $subjectid = $currentchapter->getSubjectID();
    $subject = Subject::find($subjectid);
    return Response::json($subject->getTopics());
  }

  public function getBatchID(){
  	$chapterid = Input::get('chapterid');
    Session::put('chapterid', $chapterid);
  	$batchentry = new BatchEntry;
  	return Response::json(['batchid'=>$batchentry->startEntry($chapterid)]);
  	
  }

  public function getExamNames(){
    $exam = new Exam;
    return Response::json($exam->getExamNames());
  }

  public function getQID(){
    $batchentryid = Input::get('batchid');
    $question = new Question;
    return Response::json(['currentqid'=>$question->makeNewQues($batchentryid)]);
  }

  public function postQues(){
    if(Session::get('currentqid') != Input::get('qid')){
      return Response::json('error', 400);
    }
    if(Session::get('currentbatchid') != Input::get('batchid'))
    {
       return Response::json('error', 400);
    }
    $question = Question::find(Session::get('currentqid'));
    $question->user_id = Auth::id();
    $question->batchentry_id = Input::get('batchid');
    $question->qbodytext = Input::get('qbodytext');
    $question->aoptiontext = Input::get('aoptiontext');
    $question->boptiontext = Input::get('boptiontext');
    $question->coptiontext = Input::get('coptiontext');
    $question->doptiontext = Input::get('doptiontext');
    $question->solutiontext = Input::get('solutiontext');
    $question->exam_id = Input::get('exam_id');
    $question->exam_year = Input::get('examyear');
    $question->topic_id = Input::get('topicid');
    $question->doubt = Input::get('doubt');
    $question->page_no = Input::get('pageNo');
    $question->correctans = Input::get('correctans');
    $question->complete = 1;
    $question->save();
    return Response::json(array('flash' => 'Question id',Session::get('currentqid'). 'sucessfully updated!'), 200);
  }
}

